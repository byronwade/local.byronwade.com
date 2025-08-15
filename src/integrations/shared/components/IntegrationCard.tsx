/**
 * Integration Card Component
 * Displays integration information with status, actions, and enhanced features
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Switch } from '@components/ui/switch';
import { Progress } from '@components/ui/progress';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap, 
  Link2, 
  Loader2,
  Shield,
  Star,
  Info,
  ExternalLink
} from 'lucide-react';
import { Integration, IntegrationStatus } from '../../core/types';
import { useIntegrations, useIntegrationDependencies, useEnhancedFeatures } from '../hooks/use-integrations';
import { cn } from '@utils';

interface IntegrationCardProps {
  integration: Integration;
  onConfigure?: (integration: Integration) => void;
  onViewDetails?: (integration: Integration) => void;
  showEnhancedFeatures?: boolean;
  compact?: boolean;
  className?: string;
}

export function IntegrationCard({
  integration,
  onConfigure,
  onViewDetails,
  showEnhancedFeatures = true,
  compact = false,
  className,
}: IntegrationCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const { enableIntegration, disableIntegration } = useIntegrations();
  const { dependencies, dependents, canEnable, canDisable } = useIntegrationDependencies(integration.id);
  const { featuresByIntegration } = useEnhancedFeatures();

  const enhancedFeatures = featuresByIntegration[integration.id] || [];

  const handleToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      if (integration.isEnabled) {
        await disableIntegration(integration.id);
      } else {
        await enableIntegration(integration.id);
      }
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'installing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'installing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthColor = () => {
    switch (integration.health?.status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  if (compact) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon(integration.status)}
              <span className="font-medium">{integration.displayName}</span>
              {integration.isRequired && (
                <Badge variant="secondary" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {enhancedFeatures.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{enhancedFeatures.length} enhanced features available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <Switch
              checked={integration.isEnabled}
              onCheckedChange={handleToggle}
              disabled={isToggling || (!canEnable && !integration.isEnabled) || (!canDisable && integration.isEnabled)}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {/* Enhanced Features Indicator */}
      {enhancedFeatures.length > 0 && (
        <div className="absolute top-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Enhanced
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{enhancedFeatures.length} enhanced features available</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{integration.displayName}</span>
              {integration.isRequired && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Required
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm">
              {integration.description}
            </CardDescription>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>by {integration.provider}</span>
              <span>•</span>
              <span>v{integration.version}</span>
            </div>
          </div>
        </div>

        {/* Status and Health */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <Badge className={cn('text-xs', getStatusColor(integration.status))}>
              {getStatusIcon(integration.status)}
              <span className="ml-1 capitalize">{integration.status}</span>
            </Badge>
            
            {integration.isEnabled && integration.health && (
              <div className={cn('flex items-center space-x-1 text-xs', getHealthColor())}>
                <div className={cn('w-2 h-2 rounded-full', {
                  'bg-green-500': integration.health.status === 'healthy',
                  'bg-yellow-500': integration.health.status === 'warning',
                  'bg-red-500': integration.health.status === 'critical',
                  'bg-gray-400': integration.health.status === 'unknown',
                })} />
                <span className="capitalize">{integration.health.status}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs capitalize">
              {integration.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Capabilities */}
        <div>
          <h4 className="text-sm font-medium mb-2">Capabilities</h4>
          <div className="flex flex-wrap gap-1">
            {integration.capabilities.slice(0, 4).map((capability) => (
              <Badge key={capability} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {integration.capabilities.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{integration.capabilities.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Dependencies */}
        {dependencies.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Dependencies</h4>
            <div className="space-y-1">
              {dependencies.slice(0, 2).map((dep) => (
                <div key={dep.integrationId} className="flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-1">
                    <Link2 className="h-3 w-3" />
                    <span>{dep.integrationId}</span>
                  </span>
                  {dep.required && (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  )}
                </div>
              ))}
              {dependencies.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{dependencies.length - 2} more dependencies
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Features Preview */}
        {showEnhancedFeatures && enhancedFeatures.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center space-x-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Enhanced Features</span>
            </h4>
            <div className="space-y-1">
              {enhancedFeatures.slice(0, 2).map((feature) => (
                <div key={feature.id} className="text-xs text-muted-foreground">
                  <span className="font-medium">{feature.name}</span>
                  <p className="text-xs">{feature.description}</p>
                </div>
              ))}
              {enhancedFeatures.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{enhancedFeatures.length - 2} more enhanced features
                </div>
              )}
            </div>
          </div>
        )}

        {/* Health Issues */}
        {integration.isEnabled && integration.health?.issues.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {integration.health.issues.length} health issue(s) detected.
            </AlertDescription>
          </Alert>
        )}

        {/* Metrics */}
        {integration.isEnabled && integration.metrics && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Performance</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Success Rate</span>
                <span>{integration.metrics.successRate.toFixed(1)}%</span>
              </div>
              <Progress value={integration.metrics.successRate} className="h-1" />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Avg Response: {integration.metrics.averageResponseTime}ms</span>
                <span>{integration.metrics.requests} requests</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(integration)}
            >
              <Info className="h-4 w-4 mr-1" />
              Details
            </Button>
          )}
          
          {onConfigure && integration.isEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure(integration)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!canEnable && !integration.isEnabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Missing required dependencies</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {!canDisable && integration.isEnabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Required by other integrations</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Switch
            checked={integration.isEnabled}
            onCheckedChange={handleToggle}
            disabled={
              isToggling || 
              integration.isRequired ||
              (!canEnable && !integration.isEnabled) || 
              (!canDisable && integration.isEnabled)
            }
          />
          
          {isToggling && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
